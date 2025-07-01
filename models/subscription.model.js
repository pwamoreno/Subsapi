import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [, "Price must be greater than zero"],
    },
    currency: {
      type: String,
      enum: ["NGN", "USD", "EUR", "GBP", "ZAR", "GHS"],
      default: "NGN",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      //The default should be inactive until the user opts into a subscription
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate();
        },
        message: "Renewal date must be after start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

//Auto compute renewal date
subscriptionSchema.pre("save", function (next) {
  const renewalPeriods = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    yearly: 365,
  };

  if (!this.renewalDate) {
    const renewalDate = new Date(this.startDate);
    renewalDate.setDate(renewalDate.getDate() + renewalPeriods[this.frequency]);
    this.renewalDate = renewalDate;
  }
  //Auto update status if renewal date has expired
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
