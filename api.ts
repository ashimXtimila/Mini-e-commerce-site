// Remove the CORS_PROXY line:
// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Change HASHNODE_API_URL to point to your new Next.js API route
// This will make your frontend call your Next.js server, which then calls your actual backend
const GRAPHQL_ENDPOINT = '/api/graphql'; // This is the path to your new API route

// Your GraphQL query to fetch products (adjust as per your API schema)
const PRODUCTS_QUERY = `
  {
    products {
      _id
      name
      price
      image
    }
  }
`;

// Your GraphQL query to fetch single product by ID
const PRODUCT_QUERY = (id: string) => `
  {
    product(id: "${id}") {
      _id
      name
      price
      image
      description
    }
  }
`;

// Fetch all products
export const fetchProducts = async () => {
  try {
    // Change the fetch URL:
    const response = await fetch(GRAPHQL_ENDPOINT, { // Now calling your Next.js API route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Network response was not ok:', response.status, response.statusText, errorText);
      // The error message here will now be more informative, coming from your proxy
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const json = await response.json();

    // Still good to check for GraphQL errors from the backend itself
    if (json.errors) {
      console.error('GraphQL Errors from backend:', json.errors);
      throw new Error('GraphQL error: ' + json.errors.map((e: any) => e.message).join(', '));
    }

    const products = json.data?.products;

    if (!products || !Array.isArray(products)) {
      throw new Error('Invalid product data or products array not found in API response');
    }

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Re-throw the original error or a more specific message if available
    throw error; // Or new Error('Failed to fetch products: ' + (error as Error).message);
  }
};

// Fetch single product by ID (apply the same changes here)
export const fetchProduct = async (id: string) => {
  try {
    // Change the fetch URL:
    const response = await fetch(GRAPHQL_ENDPOINT, { // Now calling your Next.js API route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: PRODUCT_QUERY(id) }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Network response was not ok:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL Errors from backend:', json.errors);
      throw new Error('GraphQL error: ' + json.errors.map((e: any) => e.message).join(', '));
    }

    const product = json.data?.product;

    if (!product) {
      throw new Error('Product not found in response data');
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error; // Or new Error('Failed to fetch product: ' + (error as Error).message);
  }
};