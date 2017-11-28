import Service from '@ember/service';
import { get } from '@ember/object';
import { getOwner } from '@ember/application';
import { service } from 'ember-decorators/service';

export default class EngineLoaderService extends Service {
  @service assetLoader;

  /**
   * Checks the owner to see if it has a registration for an Engine. This is a
   * proxy to tell if an Engine's assets are loaded or not.
   *
   * @see https://github.com/ember-engines/ember-engines/blob/8f66b5e3b8089cd53884be49f270cac05f9a3d17/addon/-private/router-ext.js#L152-L164
   *
   * @param {String} name
   * @return {Boolean}
   */
  isLoaded(name) {
    const owner = getOwner(this);
    return owner.hasRegistration(`engine:${name}`);
  }

  /**
   * Registers an Engine that was recently loaded.
   *
   * @see https://github.com/ember-engines/ember-engines/blob/8f66b5e3b8089cd53884be49f270cac05f9a3d17/addon/-private/router-ext.js#L166-L182
   *
   * @param {String} name
   */
  register(name) {
    if (this.isLoaded(name)) return;

    const owner = getOwner(this);
    owner.register(`engine:${name}`, window.require(`${name}/engine`).default);
  }

  /**
   * Loads and registers a lazy Engine.
   *
   * @param {String} name
   * @async
   */
  async load(name) {
    if (this.isLoaded(name)) return;

    const assetLoader = get(this, 'assetLoader');
    await assetLoader.loadBundle(name);
    this.register(name);
  }
}
