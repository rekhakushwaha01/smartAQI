import { useState } from 'react';
import './HealthForm.css';

const HealthForm = ({ onSubmit, loading = false }) => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    asthma: false,
    heartDisease: false,
    respiratory: false,
    smoker: false,
    city: 'delhi',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, age: Number(form.age) || 0 });
  };

  return (
    <form className="health-form card" onSubmit={handleSubmit}>
      <p className="card-title">Health Profile</p>

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <select id="city" name="city" value={form.city} onChange={handleChange}>
            <option value="delhi">New Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
            <option value="kolkata">Kolkata</option>
            <option value="chennai">Chennai</option>
          </select>
        </div>
      </div>

      <fieldset className="form-checkboxes">
        <legend>Health Conditions</legend>
        {[
          { name: 'asthma', label: 'Asthma' },
          { name: 'heartDisease', label: 'Heart Disease' },
          { name: 'respiratory', label: 'Respiratory Issues' },
          { name: 'smoker', label: 'Smoker' },
        ].map(({ name, label }) => (
          <label key={name} className="checkbox-label">
            <input
              type="checkbox"
              name={name}
              checked={form[name]}
              onChange={handleChange}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Submit Assessment'}
      </button>
    </form>
  );
};

export default HealthForm;
