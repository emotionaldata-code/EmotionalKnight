export const RetroFilters = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
            <filter id="retro-dissolve">
                <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="retro-dissolve-heavy">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="dissolve-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
            </filter>
        </defs>
    </svg>
);
