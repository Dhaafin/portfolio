// components/Text.jsx

import React from 'react';

/**
 * A flexible text component that renders as a specified HTML element (h1/h2/etc.),
 * accepts standard className, and custom props for font family.
 *
 * @param {object} props - Component properties.
 * @param {('h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'span'|'div')} [props.as] - The HTML element to render the component as. Defaults to 'p'.
 * @param {string} [props.font] - Custom font to use ('poppins' or 'inter').
 * @param {string} [props.className] - Standard CSS class names for styling.
 * @param {React.ReactNode} props.children - The content to be rendered.
 */
export default function Text({
    as: Component = 'p',
    font,
    className = '',
    children,
    ...rest
}) {
    const baseClasses = 'text-base leading-relaxed';

    let fontClass = '';
    switch (font) {
        case 'poppins':
            fontClass = 'font-poppins';
            break;
        case 'inter':
            fontClass = 'font-inter';
            break;
        default:
            fontClass = 'font-sans'; // Default font set in Tailwind or CSS
            break;
    }

    const finalClasses = [
        baseClasses,
        fontClass,
        className,
    ].filter(Boolean).join(' ');

    return (
        <Component className={finalClasses} {...rest}>
            {children}
        </Component>
    );
}