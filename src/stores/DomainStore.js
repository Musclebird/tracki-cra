import 'react-native-console-time-polyfill';

import { onPatch, onSnapshot, types } from 'mobx-state-tree';

import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import { observable } from 'mobx-react';

const uuidv1 = require('uuid/v1');
const moment = require('moment');

export const EntryModel = types.model(
    {
        timestamp: types.Date,
        dose: types.number,
        notes: types.maybe(types.string),
        photo: types.maybe(types.string),
        routeOfAdministration: types.maybe(types.string),
        measurement: types.string // TODO: Move to expandable enum or ref(? needs dedication to relational db :( )
    },
    {
        set(data) {
            for (var key in data) {
                if (this.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
        },
        setTimestamp(timestamp) {
            this.timestamp = timestamp;
            return this;
        },
        setDose(dose) {
            this.dose = dose;
            return this;
        },
        setNotes(notes) {
            this.notes = notes;
            return this;
        },
        setPhoto(photo) {
            this.photo = photo;
            return this;
        },
        setMeasurement(measurement) {
            this.measurement = measurement;
            return this;
        },
        setRouteOfAdministration(roa) {
            this.routeOfAdministration = roa;
            return this;
        }
    }
);

export const DrugTypeModel = types.model(
    {
        id: types.identifier(),
        name: types.string,
        defaultMeasurement: types.string,
        photo: types.maybe(types.string),
        defaultDose: types.maybe(types.number),
        defaultRouteOfAdministration: types.maybe(types.string),
        notes: types.maybe(types.string),
        entries: types.array(EntryModel),
        findLatestEntry() {
            return _.orderBy(this.entries, ['timestamp'], ['desc'])[0];
        },
        getEntriesForDate(date) {
            let dateMoment = moment(date);
            return _.filter(this.entries, (t) => moment(t.timestamp).isSame(dateMoment, 'day'));
        }
    },
    {
        set(data) {
            for (var key in data) {
                if (this.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
        },
        setName(name) {
            this.name = name;
            return this;
        },
        setMeasurement(measurement) {
            this.defaultMeasurement = measurement;
            return this;
        },
        setPhotoUri(uri) {
            this.photo = uri;
            return this;
        },
        setDefaultDose(dose) {
            this.defaultDose = dose;
            return this;
        },
        setDefaultRouteOfAdministration(roa) {
            this.defaultRouteOfAdministration = roa;
            return this;
        },
        setNotes(notes) {
            this.notes = notes;
            return this;
        },
        addEntry(timestamp, dose, measurement, notes, photo) {
            var entry = EntryModel.create({
                timestamp: timestamp,
                dose: dose,
                measurement: measurement,
                notes: notes,
                photo: photo
            });
            this.entries.push(entry);
            return this.entry;
        },
        addEntryFromData(data) {
            var entry = EntryModel.create(data);
            this.entries.push(entry);
            return this.entry;
        }
    }
);

const DomainStore = types.model(
    'DomainStore',
    {
        isLoaded: false,
        storageEndpoint: 'asyncStorage',
        drugs: types.array(DrugTypeModel),

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
        addDrugTypeFromData(data) {
            let dataClone = { ...data };
            dataClone['id'] = uuidv1();
            dataClone['entries'] = [];
            let newRecord = DrugTypeModel.create(dataClone);
            this.drugs.push(newRecord);
            return newRecord;
        },
        addDrugType(name, measurement, photo) {
            this.drugs.push(
                DrugTypeModel.create({
                    id: uuidv1(),
                    name: name,
                    defaultMeasurement: measurement,
                    photo: photo,
                    entries: []
                })
            );
        },
        removeDrugType(id) {
            this.drugs = this.drugs.filter((item) => item !== this.getDrugById(id));
        },
        clearAll() {
            // BE CAREFUL WITH THIS! SERIOUSLY!
            this.drugs.clear();
        },
        clearAllEntries() {
            for (var drug in this.drugs) {
                drug.entries = [];
            }
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
