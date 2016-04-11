declare module server {
	interface Matter {
		matter_id: number;
		community_id: number;
		city: string;
		country: string;
		address: string;
		bedrooms: number;
		livingrooms: number;
		bathrooms: number;
		rooms: number;
		build_area: number;
		land_area: number;
		house_area: number;
		balcony_area: number;
		umbrella_aea: number;
		public_area: number;
		age: number;
		buildhouses: number;
		typeOfHouse: string;
		managementFeeOfMonth: number;
		architecture: string;
		parking: string;
		orientation: string;
		guard: string;
		is_end: boolean;
		is_darkroom: boolean;
		wall_materials: string;
		matter_name: string;
		community: {
		};
	}
}
