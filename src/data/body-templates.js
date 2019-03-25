class ErrorMessages {
    constructor(message, errors) {
        this.message = message || '';
        this.errors = errors || [];
    }

    setMessage(message) {
        this.message = message;
        return this;
    }

    addError(error) {
        this.errors.push(error);
        return this;
    }

    setErrors(errors) {
        this.errors = errors;
        return this;
    }
}

class Pagination {
    constructor(totalItems, items) {
        this.total_items = totalItems || 0;
        this.items = items || [];
    }

    setTotalItem(totalItems) {
        this.total_items = totalItems;
        return this;
    }

    addItem(item) {
        this.items.push(item);
        return this;
    }

    setItems(items) {
        this.items = items;
        return this;
    }
}

module.exports = {
    ErrorMessages,
    Pagination
};