let customers = [];

// Join customer to chat
const customerJoin = (id, customerName, room) => {
    const customer = { id, customerName, room };
    customers.push(customer);
    return customer;
};

// Get current customer
const getCurrentCustomer = (id) => {
    return customers.find((customer) => customer.id === id);
};

// customer leaves chat
const customerLeave = (id) => {
    customers = customers.filter((customer) => customer.id !== id);
};

// customer disconnect
const customerDisconnect = (id) => {
    return customers.filter((customer) => customer.id === id)[0];
};

// Get room customers
const getRoomCustomers = (room) => {
    return customers.filter((customer) => customer.room === room);
};

// Leave customer from rooms which are not equal to entered room
const leaveCustomerFromOtherRooms = (socket, room) => {
    for (let customer of customers) {
        if (customer.id === socket.id && customer.room !== room) {
            customerLeave(socket.id);
            socket.leave(customer.room);
        }
    }
};

module.exports = {
    customerJoin,
    getCurrentCustomer,
    customerLeave,
    getRoomCustomers,
    leaveCustomerFromOtherRooms,
    customerDisconnect,
};
