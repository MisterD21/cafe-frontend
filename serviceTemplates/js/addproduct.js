function validateForm() {
    var categoryId = document.getElementById("categoryId").value;
    var productPrice = document.getElementById("productPrice").value;

    // Custom validation for numeric fields
    if (!isNumeric(categoryId)) {
        alert("Category ID must be numeric.");
        return false;
    }

    if (!isNumeric(productPrice)) {
        alert("Price must be numeric.");
        return false;
    }

    return true;
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}