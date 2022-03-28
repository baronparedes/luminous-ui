import faker from 'faker';
import moment from 'moment';

import {
  AuthProfile,
  AuthResult,
  CategoryAttr,
  ChargeAttr,
  ChargeType,
  DisbursementAttr,
  ExpenseAttr,
  PaymentDetailAttr,
  PaymentHistoryView,
  PaymentType,
  PostingType,
  ProfileAttr,
  ProfileType,
  PropertyAccount,
  PropertyAssignmentAttr,
  PropertyAttr,
  PurchaseOrderAttr,
  PurchaseRequestAttr,
  RecordStatus,
  RequestStatus,
  SettingAttr,
  TransactionAttr,
  TransactionType,
  VoucherAttr,
} from '../Api';
import {formatDate} from './dates';
import {generateNumberedSeries} from './helpers';

export function generateFakeProfileAttr(type?: ProfileType): ProfileAttr {
  return {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    id: faker.datatype.number(),
    email: faker.internet.email(),
    mobileNumber: faker.phone.phoneNumber(),
    status: faker.random.arrayElement<RecordStatus>(['active', 'inactive']),
    type:
      type ??
      faker.random.arrayElement<ProfileType>([
        'unit owner',
        'stakeholder',
        'admin',
      ]),
  };
}

export const generateFakePaymentDetail = (
  paymentType?: PaymentType
): PaymentDetailAttr => {
  return {
    id: faker.datatype.number(),
    collectedBy: faker.datatype.number(),
    orNumber: faker.random.alphaNumeric(10),
    paymentType: paymentType ?? faker.random.arrayElement(['cash', 'check']),
    checkNumber: faker.random.alphaNumeric(),
    checkIssuingBank: faker.random.words(),
    checkPostingDate: moment(faker.date.recent()).format('YYYY-MM-DD'),
    createdAt: formatDate(faker.date.recent()),
  };
};

export function generateFakeProfile(type?: ProfileType): AuthProfile {
  return {
    name: faker.name.findName(),
    username: faker.random.words(1),
    id: faker.datatype.number(),
    email: faker.internet.email(),
    mobileNumber: faker.phone.phoneNumber(),
    status: faker.random.arrayElement<RecordStatus>(['active', 'inactive']),
    remarks: faker.random.words(),
    type:
      type ??
      faker.random.arrayElement<ProfileType>([
        'unit owner',
        'stakeholder',
        'admin',
      ]),
  };
}

export function generateFakeAuthResult(): AuthResult {
  return {
    profile: generateFakeProfile(),
    token: faker.random.alphaNumeric(100),
  };
}

export function generateFakeProperty(): PropertyAttr {
  return {
    id: faker.datatype.number(),
    code: faker.datatype.string(),
    floorArea: faker.datatype.number({precision: 2}),
    address: `${faker.address.cityName()} ${faker.address.country()}`,
    status: faker.random.arrayElement<RecordStatus>(['active', 'inactive']),
  };
}

export function generateFakePropertyAssignment(): PropertyAssignmentAttr {
  return {
    profileId: faker.datatype.number(),
    propertyId: faker.datatype.number(),
    profile: generateFakeProfileAttr(),
  };
}

export function generateFakeCharge(): ChargeAttr {
  return {
    id: faker.datatype.number(),
    chargeType: faker.random.arrayElement<ChargeType>([
      'amount',
      'percentage',
      'unit',
    ]),
    code: faker.random.words(2),
    communityId: faker.datatype.number(),
    postingType: faker.random.arrayElement<PostingType>([
      'accrued',
      'manual',
      'monthly',
    ]),
    rate: faker.datatype.number(),
  };
}

export function generateFakeTransaction(): TransactionAttr {
  const charge = generateFakeCharge();
  return {
    amount: Number(faker.finance.amount(1, 1000, 2)),
    chargeId: faker.datatype.number(),
    propertyId: faker.datatype.number(),
    transactionPeriod: faker.date.recent().toDateString(),
    transactionType: faker.random.arrayElement<TransactionType>([
      'charged',
      'collected',
    ]),
    id: faker.datatype.number(),
    charge,
    rateSnapshot: charge.rate,
    comments: faker.random.words(10),
  };
}

export function generateFakePropertyAccount(
  transactionCount = 2
): PropertyAccount {
  const paymentDetails = [
    generateFakePaymentDetail(),
    generateFakePaymentDetail(),
  ];
  const property = generateFakeProperty();
  const transactions = generateNumberedSeries(transactionCount).map(() => {
    return {
      ...generateFakeTransaction(),
      paymentDetailId: faker.random.arrayElement(paymentDetails).id,
    };
  });
  const assignedProfiles = [
    generateFakeProfileAttr(),
    generateFakeProfileAttr(),
  ];
  return {
    propertyId: Number(property.id),
    property,
    balance: faker.datatype.number(),
    transactions,
    assignedProfiles,
    paymentDetails,
  };
}

export const generateFakeSetting = (): SettingAttr => {
  return {
    key: faker.random.word(),
    value: faker.random.words(),
  };
};

export const generateFakeExpense = (): ExpenseAttr => {
  const quantity = faker.datatype.number({min: 2, max: 10});
  const unitCost = faker.datatype.number();
  return {
    categoryId: faker.datatype.number(),
    category: faker.random.words(2),
    description: faker.random.words(10),
    quantity,
    unitCost,
    totalCost: quantity * unitCost,
  };
};

export const generateFakeVoucher = (): VoucherAttr => {
  return {
    id: faker.datatype.number(),
    description: faker.random.words(2),
    requestedBy: faker.datatype.number(),
    requestedByProfile: generateFakeProfileAttr(),
    requestedDate: faker.datatype.datetime().toISOString(),
    status: faker.random.arrayElement<RequestStatus>([
      'approved',
      'pending',
      'rejected',
    ]),
    totalCost: faker.datatype.number(),
    comments: faker.random.words(10),
    chargeId: faker.datatype.number(),
    expenses: [generateFakeExpense(), generateFakeExpense()],
    series: faker.random.alphaNumeric(10),
  };
};

export const generateFakePurchaseRequest = (): PurchaseRequestAttr => {
  return {
    id: faker.datatype.number(),
    description: faker.random.words(2),
    requestedBy: faker.datatype.number(),
    requestedByProfile: generateFakeProfileAttr(),
    requestedDate: faker.datatype.datetime().toISOString(),
    status: faker.random.arrayElement<RequestStatus>([
      'approved',
      'pending',
      'rejected',
    ]),
    totalCost: faker.datatype.number(),
    comments: faker.random.words(10),
    chargeId: faker.datatype.number(),
    expenses: [generateFakeExpense(), generateFakeExpense()],
    series: faker.random.alphaNumeric(10),
  };
};

export const generateFakePurchaseOrder = (): PurchaseOrderAttr => {
  return {
    id: faker.datatype.number(),
    description: faker.random.words(2),
    requestedBy: faker.datatype.number(),
    requestedByProfile: generateFakeProfileAttr(),
    requestedDate: faker.datatype.datetime().toISOString(),
    status: faker.random.arrayElement<RequestStatus>([
      'approved',
      'pending',
      'rejected',
    ]),
    totalCost: faker.datatype.number(),
    comments: faker.random.words(10),
    expenses: [generateFakeExpense(), generateFakeExpense()],
    chargeId: faker.datatype.number(),
    vendorName: faker.random.words(2),
    fulfillmentDate: faker.date.future().toISOString(),
    purchaseRequestId: faker.datatype.number(),
    otherDetails: faker.random.words(10),
    series: faker.random.alphaNumeric(10),
  };
};

export const generateFakeDisbursement = (): DisbursementAttr => {
  return {
    id: faker.datatype.number(),
    amount: faker.datatype.number(),
    details: faker.random.words(10),
    paymentType: faker.random.arrayElement(['cash', 'check']),
    checkNumber: faker.random.alphaNumeric(),
    checkIssuingBank: faker.random.words(),
    checkPostingDate: faker.datatype.datetime().toISOString(),
    releasedBy: faker.datatype.number(),
    chargeId: faker.datatype.number(),
  };
};

export const generateFakePaymentHistory = (): PaymentHistoryView => {
  return {
    amount: Number(faker.finance.amount()),
    code: faker.random.alphaNumeric(6),
    collectedBy: faker.name.firstName() + ' ' + faker.name.lastName(),
    orNumber: faker.random.alphaNumeric(6),
    paymentType: faker.random.arrayElement<PaymentType>(['cash', 'check']),
    transactionPeriod: formatDate(faker.date.recent(), 'YYYY-MM-DD'),
    checkIssuingBank: faker.company.companyName(),
    checkNumber: faker.finance.account(),
    checkPostingDate: faker.date.recent().toISOString(),
  };
};

export const generateFakeCategory = (): CategoryAttr => {
  return {
    id: faker.datatype.number(),
    communityId: faker.datatype.number(),
    description: faker.random.word(),
    subCategories: JSON.stringify([faker.random.words(), faker.random.words()]),
  };
};
