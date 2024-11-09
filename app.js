document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const skuInput = document.getElementById("skuInput");
  const productoEncontrado = document.getElementById("productoEncontrado");
  const productoNoEncontrado = document.getElementById("productoNoEncontrado");
  const productCard = document.getElementById("productCard");


  function updateProductDetails(sku, category, title, brand, imageUrl, price) {
    document.getElementById("skuResult").textContent = sku;
    document.getElementById("category").textContent = category;
    document.getElementById("productTitle").textContent = title;
    document.getElementById("productBrand").textContent = `Brand: ${brand}`;
    document.getElementById("productSku").textContent = `SKU: ${sku}`;
    document.getElementById("productPrice").textContent = `S/. ${price}`;
    
    const productImage = document.getElementById("productImage");
    productImage.src = imageUrl;
    productImage.alt = title;

    // image styles
    productImage.style.maxWidth = "100%";
    productImage.style.maxHeight = "100%";
    productImage.style.objectFit = "cover";
  }


  productCard.addEventListener("click", function () {
    const sku = document.getElementById("skuResult").textContent;
    window.location.href = `product.html?sku=${sku}`;
  });

  //Hide both containers at startup
  productoEncontrado.style.display = "none";
  productoNoEncontrado.style.display = "none";

  // add form
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const sku = skuInput.value.trim();
    if (!sku) {
      alert("Por favor ingrese un código SKU.");
      return;
    }

    const url = `https://proxy-intercorp-production.up.railway.app/api/catalog_system/pub/products/search/?sc=2&fq=skuId:${sku}&isAvailablePerSalesChannel_2:1`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const product = data[0];
          const category = product.categories?.join(", ") || "No disponible";
          const title = product.productName || "No disponible";
          const brand = product.brand || "No disponible";
          const imageUrl = product.items?.[0]?.images?.[0]?.imageUrl || "";
          const price = product.items?.[0]?.sellers?.[0]?.commertialOffer?.Price || "No disponible";

          updateProductDetails(sku, category, title, brand, imageUrl, price);

          productoEncontrado.style.display = "flex";
          productoNoEncontrado.style.display = "none";
        } else {
          document.getElementById("qskuResult").textContent = sku;

          productoEncontrado.style.display = "none";
          productoNoEncontrado.style.display = "flex";
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        productoEncontrado.style.display = "none";
        productoNoEncontrado.style.display = "flex";
        alert("Hubo un error al intentar obtener los datos. Intenta nuevamente.");
      });
  });
});
