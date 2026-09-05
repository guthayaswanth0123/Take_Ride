import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const searchLocation = catchAsync(async (req: Request, res: Response) => {
  const { query_text } = req.query;

  // Mock location data for Dhaka
  const mockLocations = [
    {
      place_id: 1,
      address_line1: "Dhanmondi 27",
      address_line2: "Dhanmondi, Dhaka",
      lat: 23.7461,
      lon: 90.3742
    },
    {
      place_id: 2,
      address_line1: "Gulshan 2",
      address_line2: "Gulshan, Dhaka",
      lat: 23.7925,
      lon: 90.4078
    },
    {
      place_id: 3,
      address_line1: "Uttara Sector 7",
      address_line2: "Uttara, Dhaka",
      lat: 23.8759,
      lon: 90.3795
    },
    {
      place_id: 4,
      address_line1: "Mirpur 10",
      address_line2: "Mirpur, Dhaka",
      lat: 23.8069,
      lon: 90.3688
    },
    {
      place_id: 5,
      address_line1: "Banani",
      address_line2: "Banani, Dhaka",
      lat: 23.7936,
      lon: 90.4066
    },
    {
      place_id: 6,
      address_line1: "Motijheel",
      address_line2: "Motijheel, Dhaka",
      lat: 23.7330,
      lon: 90.4172
    },
    {
      place_id: 7,
      address_line1: "Wari",
      address_line2: "Wari, Dhaka",
      lat: 23.7104,
      lon: 90.4074
    },
    {
      place_id: 8,
      address_line1: "Farmgate",
      address_line2: "Farmgate, Dhaka",
      lat: 23.7588,
      lon: 90.3892
    },
    {
      place_id: 9,
      address_line1: "Shahbag",
      address_line2: "Shahbag, Dhaka",
      lat: 23.7389,
      lon: 90.3958
    },
    {
      place_id: 10,
      address_line1: "New Market",
      address_line2: "New Market, Dhaka",
      lat: 23.7269,
      lon: 90.3875
    },
    {
      place_id: 11,
      address_line1: "Ramna Park",
      address_line2: "Ramna, Dhaka",
      lat: 23.7378,
      lon: 90.4044
    },
    {
      place_id: 12,
      address_line1: "Panthapath",
      address_line2: "Panthapath, Dhaka",
      lat: 23.7516,
      lon: 90.3836
    },
    {
      place_id: 13,
      address_line1: "Mohammadpur",
      address_line2: "Mohammadpur, Dhaka",
      lat: 23.7697,
      lon: 90.3563
    },
    {
      place_id: 14,
      address_line1: "Tejgaon",
      address_line2: "Tejgaon, Dhaka",
      lat: 23.7639,
      lon: 90.3889
    },
    {
      place_id: 15,
      address_line1: "Badda",
      address_line2: "Badda, Dhaka",
      lat: 23.7806,
      lon: 90.4278
    },
    {
      place_id: 16,
      address_line1: "Rampura",
      address_line2: "Rampura, Dhaka",
      lat: 23.7583,
      lon: 90.4278
    },
    {
      place_id: 17,
      address_line1: "Bashundhara R/A",
      address_line2: "Bashundhara, Dhaka",
      lat: 23.8103,
      lon: 90.4292
    },
    {
      place_id: 18,
      address_line1: "Baridhara",
      address_line2: "Baridhara, Dhaka",
      lat: 23.8000,
      lon: 90.4167
    },
    {
      place_id: 19,
      address_line1: "Lalmatia",
      address_line2: "Lalmatia, Dhaka",
      lat: 23.7583,
      lon: 90.3667
    },
    {
      place_id: 20,
      address_line1: "Shyamoli",
      address_line2: "Shyamoli, Dhaka",
      lat: 23.7750,
      lon: 90.3583
    }
  ];

  // Filter locations based on query
  const filteredLocations = mockLocations.filter(location =>
    location.address_line1.toLowerCase().includes((query_text as string)?.toLowerCase() || '') ||
    location.address_line2.toLowerCase().includes((query_text as string)?.toLowerCase() || '')
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Locations fetched successfully',
    data: filteredLocations,
  });
});

export const LocationController = {
  searchLocation,
};