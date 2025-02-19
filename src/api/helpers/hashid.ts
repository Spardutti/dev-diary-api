import Hashids from "hashids";

const HASH_SALT = process.env.HASH_SALT || "your-secret-salt";
const hashids = new Hashids(HASH_SALT, 10); // Min length of 10

export const encodeHashId = (uuid: string): string => {
	return hashids.encodeHex(uuid.replace(/-/g, "")); // Remove dashes from UUID
};

export const decodeHashId = (hash: string): string => {
	return hashids.decodeHex(hash);
};
