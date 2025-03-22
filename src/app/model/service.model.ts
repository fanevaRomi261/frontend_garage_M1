export class Service{
    _id: string;
    libelle: string;
    duree: { hours: number , minutes: number};

    constructor(_id: string, libelle: string, duree: { hours: number, minutes: number }) {
        this._id = _id;
        this.libelle = libelle;
        this.duree = duree;
    }
}
