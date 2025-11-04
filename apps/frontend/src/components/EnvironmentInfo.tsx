import React from 'react';
import { publicConfig, isDevelopment, apiUrl } from '@simpleblog/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Environment Info Component
 * Displays current environment configuration and variables
 */
export const EnvironmentInfo: React.FC = () => {
  const environmentData = [
    {
      label: 'App Name',
      value: publicConfig.appName,
      type: 'info' as 'info',
    },
    {
      label: 'App Version',
      value: publicConfig.appVersion,
      type: 'info' as 'info',
    },
    {
      label: 'Environment',
      value: publicConfig.nodeEnv,
      type: (isDevelopment() ? 'warning' : 'success') as 'warning' | 'success',
    },
    {
      label: 'API URL',
      value: publicConfig.apiUrl,
      type: 'info' as 'info',
    },
    {
      label: 'API Version',
      value: publicConfig.apiVersion,
      type: 'info' as 'info',
    },
    {
      label: 'Frontend URL',
      value: publicConfig.frontendUrl,
      type: 'info' as 'info',
    },
  ];

  const featureFlags = [
    {
      label: 'Registration',
      enabled: publicConfig.enableRegistration,
    },
    {
      label: 'Comments',
      enabled: publicConfig.enableComments,
    },
    {
      label: 'Analytics',
      enabled: publicConfig.enableAnalytics,
    },
  ];

  const apiEndpoints = [
    { name: 'Posts API', url: apiUrl('/posts') },
    { name: 'Categories API', url: apiUrl('/categories') },
    { name: 'Auth API', url: apiUrl('/auth') },
  ];

  const getBadgeVariant = (type: 'info' | 'warning' | 'success'): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'success': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Environment Configuration</h1>
        <p className="text-gray-600">
          Current environment variables and configuration
        </p>
      </div>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {environmentData.map((item) => (
              <div key={item.label} className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium text-gray-700">{item.label}:</span>
                <Badge variant={getBadgeVariant(item.type)}>
                  {item.value}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureFlags.map((flag) => (
              <div key={flag.label} className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium text-gray-700">{flag.label}:</span>
                <Badge variant={flag.enabled ? 'default' : 'outline'}>
                  {flag.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiEndpoints.map((endpoint) => (
              <div key={endpoint.name} className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium text-gray-700">{endpoint.name}:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {endpoint.url}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Info */}
      {isDevelopment() && (
        <Card>
          <CardHeader>
            <CardTitle>Development Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Development Mode Active
              </h4>
              <p className="text-yellow-700 text-sm">
                You are running in development mode. Some features may behave differently 
                or show additional debug information.
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <p><strong>Available Environment Variables:</strong></p>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  <li>NX_PUBLIC_* variables are accessible in frontend</li>
                  <li>Backend-only variables are secure and not exposed</li>
                  <li>Configuration is centralized in root .env file</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-semibold mb-3">How to use environment variables:</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { publicConfig, apiUrl, isDevelopment } from '@simpleblog/shared';

// Access configuration
const appName = publicConfig.appName;
const apiBaseUrl = publicConfig.apiUrl;

// Build API URLs
const postsUrl = apiUrl('/posts');
const authUrl = apiUrl('/auth/login');

// Environment detection
if (isDevelopment()) {
  console.log('Debug info');
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentInfo;