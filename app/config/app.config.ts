type AppConfig = {
  google: {
    clientID: string;
    clientSecret: string;
  };
  cookie: {
    secret: string;
  };
  baseUrl: string;
  storage: {
    basePath: string;
  };
  timezone: string;
  allowedEmails: string[];
  switchOffHour: number;
  switchOnHour: number;
  unifi: {
    ip: string;
    username: string;
    password: string;
    ruleName: string;
  };
};

const appConfig: AppConfig = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  cookie: {
    secret: process.env.COOKIE_SECRET!,
  },
  baseUrl: process.env.BASE_URL!,
  storage: {
    basePath: process.env.STORAGE_DIR!,
  },
  timezone: process.env.TZ!,
  allowedEmails: process.env.ALLOWED_EMAILS!.split(','),
  switchOffHour: parseInt(process.env.SWITCH_OFF_HOUR!),
  switchOnHour: parseInt(process.env.SWITCH_ON_HOUR!),
  unifi: {
    ip: process.env.UNIFI_IP!,
    username: process.env.UNIFI_USERNAME!,
    password: process.env.UNIFI_PASSWORD!,
    ruleName: process.env.UNIFI_RULE_NAME!,
  },
};

console.log(
  `client id starts with: ${appConfig.google.clientID.slice(0, 5)} and ends with ${appConfig.google.clientID.slice(
    -5,
  )}`,
);
console.log(
  `client secret starts with: ${appConfig.google.clientSecret.slice(
    0,
    5,
  )} and ends with ${appConfig.google.clientSecret.slice(-5)}`,
);

export { appConfig, type AppConfig };
