import { Controller, FWRule } from 'unifi-client';
import { appConfig } from '~/config/app.config';

class UnifiServer {
  private controller?: Controller;
  constructor() {
    this.controller = new Controller({
      url: `https://${appConfig.unifi.ip}`,
      strictSSL: false,
      username: appConfig.unifi.username,
      password: appConfig.unifi.password,
    });
    this.controller.login().catch((error) => {
      this.controller = undefined;
    });
  }
  private async getRule(): Promise<FWRule> {
    if (!this.controller) {
      throw new Error('Controller not initialized');
    }

    const site = (await this.controller.getSites())[0];
    const rules = await site.firewall.getRules();
    const rule = rules.find((r) => r.name === appConfig.unifi.ruleName);
    if (!rule) {
      throw new Error(`Unifi rule ${appConfig.unifi.ruleName} not found`);
    }
    return rule;
  }

  public async getRuleStatus(): Promise<boolean> {
    return (await this.getRule()).enabled;
  }

  public async turnOffInternet(): Promise<void> {
    console.log('Turning off internet');
    const rule = await this.getRule();
    rule.enabled = true;
    await rule.save();
  }

  public async turnOnInternet(): Promise<void> {
    console.log('Turning on internet');
    const rule = await this.getRule();
    rule.enabled = false;
    await rule.save();
  }
}

export const unifi = new UnifiServer();
