// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const skuInput = document.getElementById("skuInput");
  const productoEncontrado = document.getElementById("productoEncontrado");
  const productoNoEncontrado = document.getElementById("productoNoEncontrado");

  // Hide both containers at the beginning
  productoEncontrado.style.display = "none";
  productoNoEncontrado.style.display = "none";

  // Add a listener for the form submit event
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Capture the entered SKU
    const sku = skuInput.value.trim();
    console.log("Entered SKU:", sku);

    // Create the URL with the entered SKU
    const url = `https://proxy-intercorp-production.up.railway.app/api/catalog_system/pub/products/search/?isAvailablePerSalesChannel_2:1&sc=2&fq=skuId:${sku}`;

    // Make the request to the API
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Check if products were found
        if (data.length > 0) {
          const product = data[0]; // Take the first product (assuming it's an array)

          // Extract product data
          const category = product.categories?.join(", ") || "Not available";
          const title = product.productName || "Not available";
          const brand = product.brand || "Not available";
          const imageUrl = product.items?.[0]?.images?.[0]?.imageUrl || "";
          const price = product.items?.[0]?.sellers?.[0]?.commertialOffer?.Price || "Not available";
          const listPrice = product.items?.[0]?.sellers?.[0]?.commertialOffer?.ListPrice || "Not available";

          // Update the HTML with the retrieved data
          document.getElementById("skuResult").textContent = sku;
          document.getElementById("category").textContent = category;
          document.getElementById("productTitle").textContent = title;
          document.getElementById("productBrand").textContent = `Brand: ${brand}`;
          document.getElementById("productSku").textContent = `SKU: ${sku}`;
          document.getElementById("productPrice").textContent = `S/. ${price}`;

          // Update the product image and apply styles
          const productImage = document.getElementById("productImage");
          productImage.src = imageUrl;
          productImage.alt = title;
          
          // Apply styles directly from JS
          productImage.style.maxWidth = "100%";
          productImage.style.maxHeight = "100%";
          productImage.style.objectFit = "cover";

          // Show the "product found" container and hide the "product not found" container
          productoEncontrado.style.display = "flex";
          productoNoEncontrado.style.display = "none";

        } else {
          console.log("No products found for the entered SKU.");

          // Update the SKU in the "product not found" message
          document.getElementById("qskuResult").textContent = sku;

          // Show the "product not found" container and hide the "product found" container
          productoEncontrado.style.display = "none";
          productoNoEncontrado.style.display = "flex";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);

        // In case of error, show the "product not found" container
        productoEncontrado.style.display = "none";
        productoNoEncontrado.style.display = "flex";
      });
  });
});
