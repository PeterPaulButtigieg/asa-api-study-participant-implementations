
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/checkout" | "/order" | "/order/[id]" | "/product" | "/product/[id]";
		RouteParams(): {
			"/order/[id]": { id: string };
			"/product/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined };
			"/checkout": Record<string, never>;
			"/order": { id?: string | undefined };
			"/order/[id]": { id: string };
			"/product": { id?: string | undefined };
			"/product/[id]": { id: string }
		};
		Pathname(): "/" | "/checkout" | `/order/${string}` & {} | `/product/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}