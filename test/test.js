import { proximosFeriados as _proximosFeriados } from '../index.js';
import { assert } from 'chai';
import nock from 'nock';
import { response2020, response2021 } from './responses.js';

describe('Tests', () => {
    beforeEach(() => {
        nock('https://date.nager.at/api/v2/')
            .get('/PublicHolidays/2020/BR')
            .reply(200, response2020);

        nock('https://date.nager.at/api/v2/')
            .get('/PublicHolidays/2021/BR')
            .reply(200, response2021);
    });

    it('should return all holidays of 2020 and 2021', async () => {
        const n = 365;

        const result = await _proximosFeriados(n);

        const lastHoliday = result[result.length - 1];

        assert.include(lastHoliday.data, '2021');
    });

    it('should return the very next holiday', async () => {
        const n = 1;

        const r = await _proximosFeriados(n);

        assert.strictEqual(r.length, 1);
    });
});