interface FeatureFlags {
  enableProducts: boolean;
  enableCreatePost: boolean;
}

export const features: FeatureFlags = {
  enableProducts: false, // Set to true to enable products section
  enableCreatePost: false // Set to true to enable create post functionality
}
