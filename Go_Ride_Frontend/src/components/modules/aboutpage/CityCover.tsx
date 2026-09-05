
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Search, ArrowRight, Car, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CitiesCovered = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const citiesData = {
    bangladesh: {
      name: "Bangladesh",
      cities: [
        { name: "Dhaka", drivers: 12500, rides: 450000, popular: true },
        { name: "Chittagong", drivers: 4200, rides: 180000, popular: true },
        { name: "Sylhet", drivers: 2800, rides: 95000, popular: false },
        { name: "Khulna", drivers: 1900, rides: 75000, popular: false },
        { name: "Rajshahi", drivers: 1600, rides: 62000, popular: false },
        { name: "Barisal", drivers: 1200, rides: 48000, popular: false }
      ]
    },
    international: {
      name: "International",
      cities: [
        { name: "Kolkata", drivers: 8500, rides: 320000, popular: true },
        { name: "Dubai", drivers: 6200, rides: 280000, popular: true },
        { name: "Singapore", drivers: 5800, rides: 260000, popular: true },
        { name: "Kuala Lumpur", drivers: 4200, rides: 190000, popular: false },
        { name: "Bangkok", drivers: 3800, rides: 170000, popular: false }
      ]
    }
  };

  const allCities = [
    ...citiesData.bangladesh.cities.map(city => ({ ...city, country: 'bangladesh' })),
    ...citiesData.international.cities.map(city => ({ ...city, country: 'international' }))
  ];

  const filteredCities = allCities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || city.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const popularCities = allCities.filter(city => city.popular);

  return (
    <section id="cities" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cities We Serve
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            GoRide is available in major cities across Bangladesh and expanding internationally
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for your city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="All">All Countries</option>
              <option value="bangladesh">Bangladesh</option>
              <option value="international">International</option>
            </select>
          </div>

          {/* Popular Cities Quick Access */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Popular Cities</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularCities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(city.name)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-500 transition-colors"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCities.map((city, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </h3>
                  </div>
                  {city.popular && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="h-4 w-4" />
                    <span className="text-sm">{city.drivers.toLocaleString()}+ active drivers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{city.rides.toLocaleString()}+ rides completed</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Book Ride in {city.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Expansion Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Coming to More Cities Soon!
          </h3>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            We're expanding rapidly. Request GoRide in your city and be the first to know when we launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
              Request Your City
            </Button>
            <Button className="bg-transparent border-2 border-white hover:bg-white/20 px-8 py-6 text-lg">
              Partner With Us
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Cities Worldwide</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">40K+</div>
            <div className="text-gray-600">Active Drivers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">2M+</div>
            <div className="text-gray-600">Happy Riders</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">10M+</div>
            <div className="text-gray-600">Rides Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitiesCovered;