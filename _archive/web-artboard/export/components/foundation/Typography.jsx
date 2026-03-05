import { FONT_FAMILY } from '../../config/theme';

const VARIANTS = {
  title: { fontSize: 16, fontWeight: 500, lineHeight: 1.3, defaultTag: 'h3' },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 1.5, defaultTag: 'p' },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.4, defaultTag: 'span' },
};

export default function Typography({ theme, variant = 'body', children, as, style = {} }) {
  const config = VARIANTS[variant] || VARIANTS.body;
  const Tag = as || config.defaultTag;

  return (
    <Tag
      style={{
        margin: 0,
        padding: 0,
        fontFamily: FONT_FAMILY,
        fontSize: config.fontSize,
        fontWeight: config.fontWeight,
        lineHeight: config.lineHeight,
        color: variant === 'caption' ? theme.textMuted : theme.textPrimary,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
