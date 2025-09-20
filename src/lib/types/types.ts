export interface ImageData {
  src: string;
  fallback: string;
  alt: string;
  isDecorative?: boolean;
}

export interface Service {
  href: string;
  src: string;
  fallback: string;
  alt: string;
  title: string;
}

export interface ConsultationOption {
  type: string;
  title: string;
}
