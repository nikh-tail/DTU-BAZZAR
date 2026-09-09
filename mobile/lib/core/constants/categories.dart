import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class CategoryItem {
  final String id;
  final String name;
  final String shortName;
  final String subtitle;
  final String icon;
  final Color themeColor;
  final String imageUrl;

  const CategoryItem({
    required this.id,
    required this.name,
    required this.shortName,
    required this.subtitle,
    required this.icon,
    required this.themeColor,
    required this.imageUrl,
  });
}

class CampusConstants {
  static const List<CategoryItem> categories = [
    CategoryItem(
      id: 'DRAWING_TOOLS',
      name: 'Drawing Tools',
      shortName: 'Drawing Tools',
      subtitle: 'Calculators, drafters, scale sets & more',
      icon: '📐',
      themeColor: AppColors.catDrawingTools,
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'ELECTRONICS',
      name: 'Electronics',
      shortName: 'Electronics',
      subtitle: 'Laptops, keyboards, chargers & more',
      icon: '💻',
      themeColor: AppColors.catElectronics,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'BOOKS_NOTES',
      name: 'Books & Notes',
      shortName: 'Books & Notes',
      subtitle: 'Engineering math, syllabus books & notes',
      icon: '📚',
      themeColor: AppColors.catBooksNotes,
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'HOSTEL_REQ',
      name: 'Hostel & Req',
      shortName: 'Hostel & Req',
      subtitle: 'Coolers, mattresses, kettles & bedsheets',
      icon: '🛏️',
      themeColor: AppColors.catHostelReq,
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'FASHION',
      name: 'Fashion',
      shortName: 'Fashion',
      subtitle: 'Lab coats, hoodies, sports gear & uniforms',
      icon: '👕',
      themeColor: AppColors.catFashion,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'HOBBY_SPORT',
      name: 'Hobby / Sport',
      shortName: 'Hobby & Sport',
      subtitle: 'Cycles, badminton racquets & gym gear',
      icon: '🏸',
      themeColor: AppColors.catHobbySport,
      imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'OTHERS',
      name: 'Others',
      shortName: 'Others',
      subtitle: 'Misc campus equipment, gadgets & more',
      icon: '📦',
      themeColor: AppColors.catOthers,
      imageUrl: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&auto=format&fit=crop&q=80',
    ),
  ];

  static const List<String> dtuHostels = [
    'Aryabhatta Hostel',
    'Sir Visvesvaraya (VVS) Hostel',
    'Sir C.V. Raman Hostel',
    'Homi Bhabha Hostel',
    'APJ Abdul Kalam Hostel',
    'Sister Nivedita Hostel (Girls)',
    'Kalpana Chawla Hostel (Girls)',
    'Type-2 / Married Research Hostel',
    'Day Scholar (Outside DTU)',
  ];

  static const List<String> dtuBranches = [
    'Computer Science & Engineering (COE)',
    'Information Technology (IT)',
    'Software Engineering (SE)',
    'Mathematics & Computing (MCE)',
    'Electronics & Communication (ECE)',
    'Electrical Engineering (EE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Production & Industrial (PIE)',
    'Environmental Engineering (ENE)',
    'Biotechnology (BT)',
    'Design (B.Des)',
    'Delhi School of Management (MBA)',
  ];

  static const List<String> dtuYears = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'M.Tech / PhD',
  ];
}
