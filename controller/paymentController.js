const Payment = require('../model/paymentModel');
const Cart = require('../model/cartModel');


exports.createPayment = async (req, res) => {
    try {
        req.body.user = req.order.user;
        req.body.source_payment_id = req.body.refId;
        req.body.amount = req.body.amt;
        req.body.order = req.order._id;
        const product = new Payment(req.body);
        const createdPayment = await product.save()


          // Clear cart items for the user
          await Cart.deleteMany({ user: req.order.user });


        res.json({ message: "Payment Created Sucessfully", product: createdPayment });
    } catch (err) {
        return res.status(400).json({ error: err?.message || 'No Payments found' });
    }

};
