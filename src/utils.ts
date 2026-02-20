export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
};

// --- ANALYTICS SERVICE --- //
export const AnalyticsService = (() => {
    const sendEvent = async (event: any) => {
        console.log(`--- SIMULATED ANALYTICS EVENT ---`);
        console.log(`Type: ${event.type}`);
        console.log('Data:', event);
        console.log(`--- END ANALYTICS EVENT ---`);
    };
    return { sendEvent };
})();
