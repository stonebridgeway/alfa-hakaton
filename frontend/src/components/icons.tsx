import { WalkingManMIcon } from '@alfalab/icons-glyph/WalkingManMIcon';
import type { SVGProps } from 'react';

/**
 * «Выйти»: человечек выходит из дверного проёма, как на табличке «Выход». Готового знака в icons-glyph нет,
 * поэтому проём нарисован здесь, а человечек — WalkingManMIcon дизайн-системы, вложенный в тот же SVG 24×24.
 */
export function ExitMIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            focusable='false'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden={true}
            {...props}
        >
            <path d='M4 2h10a1 1 0 0 1 1 1v2.5h-2V4H5v16h4v2H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z' />
            {/* масштаб 0,8 и сдвиг: голова и ноги не касаются проёма, передняя нога — уже снаружи */}
            <WalkingManMIcon x={5} y={4.2} width={19.2} height={19.2} />
        </svg>
    );
}
