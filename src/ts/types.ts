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
    home?: {
      posts_per_page?: number;
      excerpt_length?: number;
      display_excerpt?: boolean;
      show_read_more?: boolean;
    };
    post?: {
      toc?: boolean;
      toc_max_depth?: number;
      copyright?: boolean;
      reading_time?: boolean;
      word_count?: boolean;
      date_format?: string;
      cover?: { enable?: boolean; default?: string };
      share?: { enable?: boolean; platforms?: string[] };
      image?: { lazy_load?: boolean; lightbox?: boolean };
      copyright_license?: string;
      copyright_license_url?: string;
    };
    appearance?: {
      default_mode?: string;
      font_size?: string;
      code_theme?: string;
      reading_progress?: boolean;
    };
    sidebar?: {
      enable?: boolean;
      position?: string;
      avatar?: { enable?: boolean; image?: string };
      social?: Record<string, string>;
      widgets?: string[];
      recent_posts_count?: number;
      tagcloud_min_font?: number;
      tagcloud_max_font?: number;
    };
    comments?: {
      enable?: boolean;
      type?: string;
      giscus?: Record<string, unknown>;
      disqus?: Record<string, unknown>;
    };
    search?: { enable?: boolean };
    outdate?: { enable?: boolean; days?: number };
    shion?: { hero_enable?: boolean; hero_image?: string; '404_image'?: string };
    custom_css?: string;
    custom_js?: string;
    [key: string]: unknown;
  };
  page?: {
    title?: string;
    path?: string;
    layout?: string;
    cover?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
