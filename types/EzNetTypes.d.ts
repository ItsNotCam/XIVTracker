// Positional data 0x01 -> 0x0F

type uint16 = number;
type uint10 = number;
type uint8 = number;
type uint6 = number;

interface PacketResponse {
	status: uint8;
	data: any | null;
}

interface DeserializedPacket {
	id: uint10;
	flag: uint6;
	payload: Buffer;
}

type EventType =
	// recv
	| "update:gil"
	| "update:location-*"
	| "update:location-all"
	| "update:location-position"
	| "update:location-area"
	| "update:location-subarea"
	| "update:location-territory"
	| "update:time"
	| "update:inventory"
	| "update:job-*"
	| "update:job-all"
	| "update:job-main"
	| "update:job-current"
	| "update:xp"
	| "update:level"
	| "update:name"

	| "ask:tcp-connected"
	| "ask:all"

	| "ask:name"
	| "ask:gil"
	| "ask:location-*"
	| "ask:location-all"
	| "ask:location-position"
	| "ask:location-area"
	| "ask:location-subarea"
	| "ask:location-territory"
	| "ask:time"
	| "ask:inventory"
	| "ask:job-*"
	| "ask:job-all"
	| "ask:job-main"
	| "ask:job-current"
	| "ask:xp"
	| "ask:level"
	| "ask:recipe"
	| "ask:is-favorite"
	| "ask:favorite-recipes"
	| "ask:recent-recipe-searches"
	| "ask:toggle-favorite-recipe"
	
	| "set:toggle-favorite-recipe"

	| "broadcast:login"
	| "broadcast:renderer-ready"
	| "broadcast:tcp-connected"
	| "set:renderer-ready"
	| "set:setup-complete";
