import {types, onSnapshot, onPatch} from "mobx-state-tree";
import {observable} from "mobx-react";
import {AsyncStorage} from "react-native";
import {DrugType, default as CabinetStore} from "./CabinetStore";

const Entry = types.model(
    {
        id: types.number,
        drug: types.reference(DrugType),
        dose: types.number,
        measurement: types.string // TODO: Move to expandable enum or ref(? needs dedication to relational db :( )
    },
    {
        setData(drug, dose, measurement) {
            // TODO: if string lookup, if ref....don't
        }
    }
);
