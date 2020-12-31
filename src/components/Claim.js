import { useData } from '../dataContext'
import { Row } from './shared/Value'
import { useState, useEffect } from 'react'
import { useTransaction } from '../dataContext/transactions'
import { useWeb3 } from '../web3'
import { Button } from './shared/Button'

const Claim = () => {
  const {
    myRewardsPerTime,
    myPendingRewards,
    myClaimedRewards,
    myTotalRewards,
  } = useData()

  const { account } = useWeb3()
  const { liquidityMining, canPayout } = useData()

  const { contractCall, pending } = useTransaction()
  const [payoutEnabled, setPayoutEnabled] = useState(false)

  useEffect(() => {
    setPayoutEnabled(!pending && canPayout)
  }, [pending, canPayout])

  const payout = () => {
    contractCall(
      liquidityMining.payout, [account, { gasLimit: 200000 }],
      "Paying out rewards...", "Payout failed!", "Payout successful!"
    )
  }

  return (
    <div className="mx-8 mb-12 text-sm">
      <div className="mx-4 mb-4">
        <div className="mb-3">
          <Row value={myRewardsPerTime}>My SARCO Per Second</Row>
        </div>
        <Row value={myPendingRewards}>My SARCO Pending</Row>
        <Row value={myClaimedRewards}>My SARCO Claimed</Row>
        <Row value={myTotalRewards} total>My SARCO Total</Row>
      </div>
      <Button disabled={!payoutEnabled} onClick={payout}>
        Claim My SARCO
      </Button>
    </div>
  )
}

export default Claim
