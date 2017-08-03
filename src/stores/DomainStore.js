import 'react-native-console-time-polyfill';

import { onPatch, onSnapshot, types } from 'mobx-state-tree';

import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import { observable } from 'mobx-react';

const uuidv1 = require('uuid/v1');

export const DrugTypeModel = types.model(
    {
        id: types.identifier(),
        name: types.string,
        defaultMeasurement: types.string,
        photo: types.maybe(types.string)
    },
    {
        setName(name) {
            this.name = name;
        },
        setMeasurement(measurement) {
            this.defaultMeasurement = measurement;
        },
        setPhotoUri(uri) {
            this.photo = uri;
        }
    }
);

export const EntryModel = types.model(
    {
        id: types.identifier(),
        drug: types.reference(DrugTypeModel),
        dose: types.number,
        notes: types.maybe(types.string),
        measurement: types.string // TODO: Move to expandable enum or ref(? needs dedication to relational db :( )
    },
    {
        setData(drug, dose, measurement) {
            this.drug = drug;
            this.dose = dose;
            this.measurement = measurement;
        }
    }
);

const DomainStore = types.model(
    'DomainStore',
    {
        isLoaded: false,
        storageEndpoint: 'asyncStorage',
        drugs: types.array(DrugTypeModel),
        entries: types.array(EntryModel),

        getDrugById(id) {
            return _.find(this.drugs, (t) => t.id === id);
        },
        searchDrugsByName(name) {
            if (!name || name.length == 0) {
                return this.drugs;
            }
            return _.filter(this.drugs, (t) => t.name.toUpperCase().startsWith(name.toUpperCase()));
        },
        getEntryById(id) {
            return _.find(this.entries, (t) => t.id === id);
        }
    },
    {
        addDrugType(name, measurement, photo) {
            this.drugs.push(
                DrugTypeModel.create({ id: uuidv1(), name: name, defaultMeasurement: measurement, photo: photo })
            );
        },
        removeDrugType(id) {
            this.drugs = this.drugs.filter((item) => item !== this.getDrugById(id));
        },
        clearAll() {
            // BE CAREFUL WITH THIS! SERIOUSLY!
            this.drugs.clear();
        },
        debugMassAdd(amount) {
            console.time('massAdd' + amount);
            for (var i = 0; i < amount; ++i) {
                this.drugs.push(
                    DrugTypeModel.create({ id: uuidv1(), name: uuidv1(), defaultMeasurement: 'g', photo: null })
                );
            }
            console.timeEnd('massAdd' + amount);
        },

        *fetchDrugs() {
            // Async things must work as generators. Whatever.
            try {
                // TODO: switch/fetch based on storageEndpoint
                // TODO: abstract out in to class with standard interface
                this.isLoaded = false;
                this.drugs.clear();
                console.time('fetchCabinet');
                let storedDrugArray = yield AsyncStorage.getItem('DomainStore::drugs');
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
            console.timeEnd('fetchCabinet');

            return this.drugs.length;
        }
    }
);

const storeInstance = DomainStore.create({ drugs: [], entries: [] });

storeInstance.fetchDrugs().then(() => {
    onSnapshot(storeInstance, (snapshot) => {
        if (snapshot.storageEndpoint == 'asyncStorage' && snapshot.isLoaded) {
            console.time('asyncStorage');
            AsyncStorage.setItem('DomainStore::drugs', JSON.stringify(snapshot.drugs)).then(() => {
                console.timeEnd('asyncStorage');
            });
        }
    });
});

export default storeInstance;
