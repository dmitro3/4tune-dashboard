import { withHandlers } from 'recompose';
import { promisify } from 'bluebird';
import { round } from 'lodash';

import { DiceContract } from '../../../../contracts';
import AmountField from '../../components/withdraw/AmountField';

const withIncBy = withHandlers({
    /**
     * Fill withdraw field with specified percent from total contract balance.
     */
    incBy: ({ field }) => {
        const { web3 } = window;

        return async value => {
            const balance = await DiceContract.deployed()
                .then(instance => {
                    const getBalance = promisify(web3.eth.getBalance, {
                        context: web3,
                    });
                    return getBalance(instance.address);
                })
                .then(balance => {
                    return window.web3.fromWei(balance, 'ether');
                });

            const amount = round(balance * parseFloat(value, 10), 3);

            field.onChange({
                target: {
                    name: field.name,
                    value: amount,
                },
            });
        };
    },
});

export default withIncBy(AmountField);
