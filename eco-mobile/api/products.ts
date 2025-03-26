const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function listProducts() {
  try {
    const res = await fetch(`${API_URL}/products`); // Add a specific endpoint
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`); // Provide more detailed error
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to fetch products. Please try again later.");
  }
}

export async function fetchProductById(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error('Error');
  }
  return data;
}

export async function likeProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Error');
  }
  return data;
}
