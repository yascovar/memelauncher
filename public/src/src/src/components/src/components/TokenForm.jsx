import React, { useState } from 'react'

export default function TokenForm() {
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    supply: '',
    website: '',
    twitter: '',
    telegram: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    alert(`Creating token:\n
      Name: ${form.name}
      Symbol: ${form.symbol}
      Supply: ${form.supply}
      Website: ${form.website}
      Twitter: ${form.twitter}
      Telegram: ${form.telegram}
    `)

    // You’ll plug in the real mint logic here later
  }

  return (
    <div>
      <input placeholder="Token Name" name="name" onChange={handleChange} /><br /><br />
      <input placeholder="Symbol" name="symbol" onChange={handleChange} /><br /><br />
      <input placeholder="Total Supply" name="supply" onChange={handleChange} /><br /><br />
      <input placeholder="Website URL" name="website" onChange={handleChange} /><br /><br />
      <input placeholder="Twitter Link" name="twitter" onChange={handleChange} /><br /><br />
      <input placeholder="Telegram Link" name="telegram" onChange={handleChange} /><br /><br />
      <button onClick={handleSubmit}>Create Token</button>
    </div>
  )
}
