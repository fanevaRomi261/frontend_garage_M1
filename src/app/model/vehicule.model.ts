import { TypeVehicule } from "./typevehicule.model";

export class Vehicule{
    _id: string;
    immatriculation : string;
    modele : string;
    marque : string;
    type_vehicule_id : TypeVehicule;
    utilisateur_id : string;

    constructor(_id: string, immatriculation: string , modele : string , marque : string ,type_vehicule : TypeVehicule ,utilisateur_id : string){
        this._id = _id;
        this.immatriculation = immatriculation;
        this.modele = modele;
        this.marque = marque;
        this.type_vehicule_id = type_vehicule;
        this.utilisateur_id = utilisateur_id;
    }
}