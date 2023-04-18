import Joi from 'joi';

type CreatePaymentType = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export const createPaymentSchema = Joi.object<CreatePaymentType>({
  ticketId: Joi.number().required(),
  cardData: Joi.object()
    .keys({
      issuer: Joi.string().required(),
      number: Joi.number().required(),
      name: Joi.string().required(),
      expirationDate: Joi.date().required(),
      cvv: Joi.number().required(),
    })
    .required(),
});