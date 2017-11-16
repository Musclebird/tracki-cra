import 'react-native-console-time-polyfill';

import { onPatch, onSnapshot, flow, types } from 'mobx-state-tree';

import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import { observable } from 'mobx-react';

const uuidv1 = require('uuid/v1');
const moment = require('moment');

export const EntryModel = types
    .model('UsageEntry', {
        timestamp: types.Date,
        dose: types.number,
        notes: types.maybe(types.string),
        photo: types.maybe(types.string),
        routeOfAdministration: types.maybe(types.string),
        measurement: types.string
    })
    .actions((self) => ({
        set(data) {
            for (var key in data) {
                if (self.hasOwnProperty(key)) {
                    self[key] = data[key];
                }
            }
        },
        setTimestamp(timestamp) {
            self.timestamp = timestamp;
            return self;
        },
        setDose(dose) {
            self.dose = dose;
            return self;
        },
        setNotes(notes) {
            self.notes = notes;
            return self;
        },
        setPhoto(photo) {
            self.photo = photo;
            return self;
        },
        setMeasurement(measurement) {
            self.measurement = measurement;
            return self;
        },
        setRouteOfAdministration(roa) {
            self.routeOfAdministration = roa;
            return self;
        }
    }));

export const DrugTypeModel = types
    .model('DrugType', {
        id: types.identifier(),
        name: types.string,
        defaultMeasurement: types.string,
        photo: types.maybe(types.string),
        defaultDose: types.maybe(types.number),
        defaultRouteOfAdministration: types.maybe(types.string),
        notes: types.maybe(types.string),
        entries: types.array(EntryModel)
    })
    .views((self) => ({
        get latestEntry() {
            return _.orderBy(self.entries, ['timestamp'], ['desc'])[0];
        },
        getEntriesForDate(date) {
            let dateMoment = moment(date);
            return _.filter(self.entries, (t) => moment(t.timestamp).isSame(dateMoment, 'day'));
        },
        getAverageTimeBetweenEntries(count) {
            if(self.entries == null || self.entries.length <= 0) {
                return -1;
            }

            if(self.entries.length == 1) {
                return moment().unix() - self.entries[0].timestamp
            }

            if (count > self.entries.length) {
                count = self.entries.length;
            }

            let sortedEntries = _.sortBy(self.entries, (x) => x.timestamp);
            let timeBetween =
                (_.last(sortedEntries).timestamp - sortedEntries[count - self.entries.length].timestamp) /
                (sortedEntries.length - 1) /
                1000.0;

            return timeBetween;
        },
        getLongestTimeBetweenEntries() {
            let sortedEntries = _.sortBy(self.entries, (x) => x.timestamp);
            let longestTime = 0;
            for (var i = sortedEntries.length - 1; i > 0; i--) {
                let time = sortedEntries[i].timestamp - sortedEntries[i - 1].timestamp;
                if (time > longestTime) {
                    longestTime = time;
                }
            }
            return longestTime / 1000.0;
        }
    }))
    .actions((self) => ({
        set(data) {
            for (var key in data) {
                if (self.hasOwnProperty(key)) {
                    self[key] = data[key];
                }
            }
        },
        setName(name) {
            self.name = name;
            return self;
        },
        setMeasurement(measurement) {
            self.defaultMeasurement = measurement;
            return self;
        },
        setPhotoUri(uri) {
            self.photo = uri;
            return self;
        },
        setDefaultDose(dose) {
            self.defaultDose = dose;
            return self;
        },
        setDefaultRouteOfAdministration(roa) {
            self.defaultRouteOfAdministration = roa;
            return self;
        },
        setNotes(notes) {
            self.notes = notes;
            return self;
        },
        addEntry(timestamp, dose, measurement, notes, photo) {
            var entry = EntryModel.create({
                timestamp: timestamp,
                dose: dose,
                measurement: measurement,
                notes: notes,
                photo: photo
            });
            self.entries.push(entry);
            return self.entry;
        },
        addEntryFromData(data) {
            var entry = EntryModel.create(data);
            self.entries.push(entry);
            return self.entry;
        }
    }));

const DomainStore = types
    .model('DomainStore', {
        isLoading: true,
        storageEndpoint: 'asyncStorage',
        drugs: types.array(DrugTypeModel)
    })
    .views((self) => ({
        getDrugById(id) {
            return _.find(self.drugs, (t) => t.id === id);
        },
        searchDrugsByName(name) {
            if (!name || name.length == 0) {
                return self.drugs;
            }
            return _.filter(self.drugs, (t) => t.name.toUpperCase().startsWith(name.toUpperCase()));
        },
        getEntryById(id) {
            return _.find(self.entries, (t) => t.id === id);
        }
    }))
    .actions((self) => ({
        addDrugTypeFromData(data) {
            let dataClone = { ...data };
            dataClone['id'] = uuidv1();
            dataClone['entries'] = [];
            let newRecord = DrugTypeModel.create(dataClone);
            self.drugs.push(newRecord);
            return newRecord;
        },
        addDrugType(name, measurement, photo) {
            self.drugs.push(
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
            self.drugs = self.drugs.filter((item) => item !== self.getDrugById(id));
        },
        clearAll() {
            // BE CAREFUL WITH self! SERIOUSLY!
            self.drugs.clear();
        },
        clearAllEntries() {
            for (var drug in self.drugs) {
                drug.entries = [];
            }
        },
        debugMassAdd(amount) {
            console.time('massAdd' + amount);
            for (var i = 0; i < amount; ++i) {
                self.drugs.push(
                    DrugTypeModel.create({ id: uuidv1(), name: uuidv1(), defaultMeasurement: 'g', photo: null })
                );
            }
            console.timeEnd('massAdd' + amount);
        },

        fetchDrugs: flow(function*() {
            // Async things must work as generators. Whatever.
            try {
                // TODO: switch/fetch based on storageEndpoint
                // TODO: abstract out in to class with standard interface
                self.isLoading = true;
                self.drugs.clear();
                console.time('fetchCabinet');
                let storedDrugArray = yield AsyncStorage.getItem('DomainStore::drugs');
                if (storedDrugArray !== null) {
                    storedDrugArray = JSON.parse(storedDrugArray);
                    if (storedDrugArray && storedDrugArray.length > 0) {
                        self.drugs.push.apply(self.drugs, storedDrugArray);
                    }
                }
                self.isLoading = false;
            } catch (e) {
                console.log(e);
            }
            self.isLoading = false;
            console.timeEnd('fetchCabinet');

            return self.drugs.length;
        })
    }));

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
