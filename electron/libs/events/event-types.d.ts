type EventType =
	// recv
	| "update:gil"

	| "update:location-*"
	| "update:location-all"
	| "update:location-position"
	| "update:location-area"
	| "update:location-region"
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
	| "ask:location-region"
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
	| "broadcast:logout"
	| "broadcast:renderer-ready"
	| "broadcast:tcp-connected"
	| "set:renderer-ready"
	| "set:setup-complete";