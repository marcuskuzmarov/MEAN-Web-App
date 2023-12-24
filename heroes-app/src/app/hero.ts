export interface Hero {
    id: number;
    name: string;
    gender: string;
    eyeColor: string;
    race: string;
    hairColor: string;
    height: number;
    publisher: string;
    skinColor: string;
    alignment: string;
    weight: number;
    powers: string[];
    [key: string]: any;
}