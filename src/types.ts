export interface TraceabilityRecord {
    batchId: string;
    productName: string;
    farm: {
        name: string;
        mapEmbedUrl: string;
        harvestDate: string;
    };
    milling: {
        date: string;
        facility: string;
    };
    logistics: {
        mode: string;
        departure: string;
        arrival: string;
    };
    packagingAndStorage: {
        packagingDate: string;
        material: string;
        warehouse: string;
        conditions: string;
    };
    quality: {
        moisture: string;
        brokenGrains: string;
        purity: string;
        avgGrainLength: string;
        grade: string;
        testedBy: string;
    };
    certifications: string;
}

export interface Product {
    id: number;
    name: string;
    priceINR: number;
    image: string;
    description: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    subtotal: number;
    taxes: number;
    total: number;
    shippingDetails: CustomerDetails;
}

export interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}
