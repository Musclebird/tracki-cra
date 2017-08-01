import {types, onSnapshot, onPatch} from "mobx-state-tree";
import {observable} from "mobx-react";
import {AsyncStorage} from "react-native";
import "react-native-console-time-polyfill";
const uuidv1 = require("uuid/v1");

export const DrugType = types.model(
    {
        id: types.identifier(),
        name: types.string,
        defaultMeasurement: types.string
    },
    {
        setName(name) {
            this.name = name;
        },
        setMeasurement(measurement) {
            this.defaultMeasurement = measurement;
        }
    }
);

const CabinetStore = types.model(
    "CabinetStore",
    {
        isLoaded: false,
        storageEndpoint: "asyncStorage",
        drugs: types.array(DrugType),
        getDrugById(id) {
            console.log(id);
            return this.drugs.filter(t => t.id === id)[0];
        }
    },
    {
        addDrugType(name, measurement) {
            this.drugs.push(
                DrugType.create({
                    id: uuidv1(),
                    name: name,
                    defaultMeasurement: measurement
                })
            );
        },
        removeDrugType(id) {
            this.drugs = this.drugs.filter(item => item !== this.getDrugById(id));
        },
        clearAll() {
            // BE CAREFUL WITH THIS! SERIOUSLY!
            this.drugs.clear();
        },
        debugMassAdd(amount) {
            console.time("massAdd" + amount);
            for (var i = 0; i < amount; ++i) {
                this.drugs.push(
                    DrugType.create({
                        id: uuidv1(),
                        name: uuidv1(),
                        defaultMeasurement: "g"
                    })
                );
            }
            console.timeEnd("massAdd" + amount);
        },

        *fetchDrugs() {
            // Async things must work as generators. Whatever.
            try {
                // TODO: switch/fetch based on storageEndpoint
                // TODO: abstract out in to class with standard interface
                this.isLoaded = false;
                this.drugs.clear();
                console.time("fetchCabinet");
                let storedDrugArray = yield AsyncStorage.getItem("CabinetStore:drugs");
                if (storedDrugArray !== null) {
                    storedDrugArray = JSON.parse(storedDrugArray);
                    if (storedDrugArray && storedDrugArray.length > 0) {
                        this.drugs.push.apply(this.drugs, storedDrugArray);
                    }
                }
                this.isLoaded = true;
            } catch (e) {
                console.log(e);
            }
            this.isLoaded = true;
            console.timeEnd("fetchCabinet");

            return this.drugs.length;
        }
    }
);

const storeInstance = CabinetStore.create({
    drugs: []
});

storeInstance.fetchDrugs().then(() => {
    onSnapshot(storeInstance, snapshot => {
        if (snapshot.storageEndpoint == "asyncStorage" && snapshot.isLoaded) {
            console.time("asyncStorage");
            AsyncStorage.setItem("CabinetStore:drugs", JSON.stringify(snapshot.drugs)).then(() => {
                console.timeEnd("asyncStorage");
            });
        }
    });
});

export default storeInstance;
