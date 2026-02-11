/**
 * Utility functions for formatting carnival dates
 */

const MONTHS_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

/**
 * Formats a date range for carnival display
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param endDate - ISO date string (YYYY-MM-DD)
 * @returns Formatted string like "13 a 17 de Fevereiro, 2026"
 */
export function formatCarnivalDateRange(startDate: string, endDate: string): string {
    if (!startDate || !endDate) {
        return '13 a 17 de Fevereiro, 2026'; // Fallback
    }

    try {
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T00:00:00');

        const startDay = start.getDate();
        const endDay = end.getDate();
        const month = MONTHS_PT[start.getMonth()];
        const year = start.getFullYear();

        return `${startDay} a ${endDay} de ${month}, ${year}`;
    } catch (error) {
        console.error('Error formatting date range:', error);
        return '13 a 17 de Fevereiro, 2026'; // Fallback
    }
}

/**
 * Formats a date range for carnival display in uppercase
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param endDate - ISO date string (YYYY-MM-DD)
 * @returns Formatted string like "13 A 17 DE FEVEREIRO, 2026"
 */
export function formatCarnivalDateRangeUppercase(startDate: string, endDate: string): string {
    return formatCarnivalDateRange(startDate, endDate).toUpperCase();
}

/**
 * Formats location string
 * @param city - City name
 * @param state - State name
 * @returns Formatted string like "Paracuru, Ceará - Brasil"
 */
export function formatLocation(city: string, state: string): string {
    if (!city || !state) {
        return 'Paracuru, Ceará - Brasil'; // Fallback
    }
    return `${city}, ${state} - Brasil`;
}
