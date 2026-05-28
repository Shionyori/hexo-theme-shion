export interface HexoHelperContext {
  config: {
    title: string;
    author?: string;
    description?: string;
    language?: string;
    url: string;
    [key: string]: unknown;
  };
  theme: {
    home?: { excerpt_length?: number; display_excerpt?: boolean; show_read_more?: boolean };
    post?: { toc?: boolean; toc_max_depth?: number; copyright?: boolean; reading_time?: boolean; word_count?: boolean; date_format?: string; image?: { lazy_load?: boolean } };
    appearance?: { default_mode?: string };
    sidebar?: { enable?: boolean; position?: string; avatar?: { enable?: boolean; image?: string }; social?: Record<string, string> };
    comments?: { enable?: boolean; type?: string; giscus?: Record<string, unknown> };
    search?: { enable?: boolean };
    shion?: { hero_enable?: boolean; hero_image?: string; '404_image'?: string };
    [key: string]: unknown;
  };
  page?: {
    title?: string;
    path?: string;
    layout?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
