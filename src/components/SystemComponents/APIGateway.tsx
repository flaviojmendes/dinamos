import React from 'react';
import { useTranslation } from 'react-i18next';

export default function APIGateway() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          {t('components.api_gateway.title')}
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          {t('components.api_gateway.lead1')}
        </p>

        <p className="text-xl text-zinc-300 mb-12">
          {t('components.api_gateway.lead2')}
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('components.api_gateway.functions_title')}
        </h2>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.api_gateway.auth_title')}</h3>
            <p className="text-zinc-200">
              {t('components.api_gateway.auth_p')}
            </p>
            <div className="mt-4 bg-zinc-800 p-4 rounded">
              <p className="font-medium text-blue-200">{t('components.common.example')}</p>
              <p className="text-zinc-300">
                {t('components.api_gateway.auth_example', {
                  defaultValue:
                    'To access your online bank account, you need to enter your username and password. The API Gateway ensures that only you, with the correct credentials, can access your information.'
                })}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.api_gateway.routing_title')}</h3>
            <p className="text-zinc-200">
              {t('components.api_gateway.routing_p')}
            </p>
            <div className="mt-4 bg-zinc-800 p-4 rounded">
              <p className="font-medium text-blue-200">{t('components.common.example')}</p>
              <p className="text-zinc-300">
                {t('components.api_gateway.routing_example', {
                  defaultValue:
                    'In an e-commerce app, a product request can be routed to the inventory service, while payment is routed to the payment processing service.'
                })}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.api_gateway.ratelimit_title')}</h3>
            <p className="text-zinc-200">
              {t('components.api_gateway.ratelimit_p')}
            </p>
            <div className="mt-4 bg-zinc-800 p-4 rounded">
              <p className="font-medium text-blue-200">{t('components.common.example')}</p>
              <p className="text-zinc-300">
                {t('components.api_gateway.ratelimit_example', {
                  defaultValue:
                    'A weather forecast API service can limit the number of requests per user to prevent abuse and ensure the service is available to everyone.'
                })}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.api_gateway.aggregation_title')}</h3>
            <p className="text-zinc-200">
              {t('components.api_gateway.aggregation_p')}
            </p>
            <div className="mt-4 bg-zinc-800 p-4 rounded">
              <p className="font-medium text-blue-200">{t('components.common.example')}</p>
              <p className="text-zinc-300">
                {t('components.api_gateway.aggregation_example', {
                  defaultValue:
                    'In a travel app, the API Gateway can aggregate information from flights, hotels, and car rentals from different providers into a single response for the user.'
                })}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('components.api_gateway.micro_title')}
        </h2>

        <p className="text-xl text-zinc-300 mb-6">
          {t('components.api_gateway.micro_intro')}
        </p>

        <div className="bg-zinc-800 rounded p-4 mt-8">
          <p className="font-medium text-blue-200 mb-2">{t('components.common.example')}</p>
          <p className="text-zinc-300">
            {t('components.api_gateway.micro_example')}
          </p>
        </div>
      </div>
    </div>
  );
} 