import faker from 'faker'
import _ from 'lodash'
import { utils } from '@ensdomains/ui'
import { trackReferral } from '../utils//analytics'
import EthVal from 'ethval'

function getRandomReferrer() {
  const referrers = ['kickback', 'opensea', 'etherscan']
  const num = _.random(0, referrers.length - 1)
  return referrers[num]
}

export default function seed(seedAmount) {
  const arr = Array.from(new Array(seedAmount))

  const listOfDomains = arr.map(() => {
    const label = faker.internet.domainWord()
    return {
      label,
      transactionId: utils.keccak256(utils.toUtf8Bytes(label)),
      type: Math.random() > 0.5 ? 'renew' : 'register',
      price: new EthVal(_.random(0.01, 1), 'eth').toWei().toString(),
      referrer: getRandomReferrer()
    }
  })

  listOfDomains.forEach((d, i) => {
    trackReferral({
      ...d,
      labels: [d.label]
    })
    console.log(i, 'finished tracking for ' + i, d.label)
    console.log(d)
  })
}