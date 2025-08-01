import type { CommandGroup } from "@/types/Commands";
import {
	CakeSlice,
	ChefHat,
	Laptop,
	Settings,
	ShoppingBasket,
} from "lucide-vue-next";
import { defineStore } from "pinia";

export const useCommandsStore = defineStore("commands", {
	state: () =>
		[
			{
				title: "Routes",
				commands: [
					{
						type: "link",
						id: "route_cafe",
						name: "Kafe",
						href: "/cafe",
						icon: CakeSlice,
					},
					{
						type: "link",
						id: "route_kitchen",
						name: "Mutfak",
						href: "/kitchen",
						icon: ChefHat,
					},
					{
						type: "link",
						id: "route_market",
						name: "Market",
						href: "/market",
						icon: ShoppingBasket,
					},
				],
			},
			{
				title: "Ayarlar",
				commands: [
					{
						type: "link",
						name: "Tercihler",
						href: "/settings",
						id: "preferences",
						icon: Settings,
					},
					{
						type: "link",
						name: "Cihazlar",
						href: "/settings/devices",
						id: "devices",
						icon: Laptop,
					},
				],
			},
		] as CommandGroup[],
});
