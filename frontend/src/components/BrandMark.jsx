import { APP_COPY } from '../constants/copy';

export function BrandMark({ compact = false }) {
  return (
    <div className={`brand-mark${compact ? ' brand-mark--compact' : ''}`}>
      <span className="brand-mark__icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{APP_COPY.NAME}</span>
    </div>
  );
}
