export function responsivePadding(isMobile: boolean) {
  return isMobile ? "px-4" : "px-8";
}

export function responsiveSectionGap(isMobile: boolean) {
  return isMobile ? "gap-6" : "gap-10";
}

export function responsiveContainerWidth(isMobile: boolean) {
  return isMobile ? "max-w-full" : "max-w-7xl";
}