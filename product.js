// Get SKU from URL
const urlParams = new URLSearchParams(window.location.search);
const sku = urlParams.get("sku");

// URL to get the product by its SKU
const url = `https://proxy-intercorp-production.up.railway.app/api/catalog_system/pub/products/search/?sc=2&fq=skuId:${sku}&isAvailablePerSalesChannel_2:1`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    if (data.length > 0) {
      const product = data[0];

      // Update product details
      document.getElementById("productTitle").textContent = product.productName || "No disponible";
      document.getElementById("productCategory").textContent = product.categories?.join(", ") || "No disponible";
      document.getElementById("productBrand").textContent = product.brand || "No disponible";
      document.getElementById("productSku").textContent = `SKU: ${sku}`;
      document.getElementById("productDescription").textContent = product.description || "No disponible";

      // Set the product image
      const imageUrl = product.items?.[0]?.images?.[0]?.imageUrl || "";
      const productImage = document.getElementById("productImage");
      productImage.src = imageUrl;
      productImage.alt = product.productName || "Producto sin nombre";

      // Prices
      const price = product.items?.[0]?.sellers?.[0]?.commertialOffer?.Price || "No disponible";
      const listPrice = product.items?.[0]?.sellers?.[0]?.commertialOffer?.ListPrice || "No disponible";
      document.getElementById("productBasePrice").textContent = `S/. ${price}`;
      document.getElementById("productListPrice").textContent = `S/. ${listPrice}`;

      // Technical Sheet
      const productPropertiesContainer = document.getElementById("productProperties");
      productPropertiesContainer.innerHTML = ""; 

      // Check if there is a technical sheet
      if (product["Ficha Técnica"] && Array.isArray(product["Ficha Técnica"])) {
        product["Ficha Técnica"].forEach((attribute) => {
          const value = product[attribute]?.[0] ?? "No disponible";

          // Create a new row
          const propertyRow = document.createElement("div");
          propertyRow.classList.add("content");
          propertyRow.style = `
            display: grid;
            grid-template-columns: 1fr 2fr;
            padding: 10px;
            border-bottom: 1px solid #ddd;
          `;

          // Create the property title (in bold)
          const propertyName = document.createElement("span");
          propertyName.textContent = attribute;
          propertyName.classList.add("property-title");
          propertyName.style.fontWeight = "bold";

          //Creating property value
          const propertyValue = document.createElement("span");
          propertyValue.textContent = value;
          propertyValue.classList.add("property-value"); 
          propertyValue.style.marginLeft = "20px"; 

          //Add to queue container
          propertyRow.appendChild(propertyName);
          propertyRow.appendChild(propertyValue);

         
          productPropertiesContainer.appendChild(propertyRow);
        });
      } else {
        // Show message if there is no technical sheet
        const noDataRow = document.createElement("div");
        noDataRow.classList.add("content");
        noDataRow.style = `
          display: grid;
          grid-template-columns: 1fr 2fr;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        `;
        const noDataText = document.createElement("span");
        noDataText.textContent = "No hay ficha técnica disponible";
        noDataRow.appendChild(noDataText);
        productPropertiesContainer.appendChild(noDataRow);
      }
    } else {
      alert("Producto no encontrado.");
    }
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
    alert("Hubo un error al intentar obtener los datos. Intenta nuevamente.");
  });
