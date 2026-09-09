class UserModel {
  final String id;
  final String email;
  final String name;
  final String? branch;
  final String? year;
  final String? userType; // HOSTELER, DAY_SCHOLAR
  final String? hostel;
  final String? roomNumber;
  final String? phone;
  final String? avatar;
  final double rating;
  final int reviewCount;
  final bool isVerified;
  final bool isProSeller;
  final int maxListings;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    this.branch,
    this.year,
    this.userType,
    this.hostel,
    this.roomNumber,
    this.phone,
    this.avatar,
    this.rating = 5.0,
    this.reviewCount = 0,
    this.isVerified = false,
    this.isProSeller = false,
    this.maxListings = 3,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? 'DTU Student',
      branch: json['branch'],
      year: json['year'],
      userType: json['userType'],
      hostel: json['hostel'],
      roomNumber: json['roomNumber'],
      phone: json['phone'],
      avatar: json['avatar'],
      rating: (json['rating'] != null) ? (json['rating'] as num).toDouble() : 5.0,
      reviewCount: json['reviewCount'] ?? 0,
      isVerified: json['isVerified'] ?? false,
      isProSeller: json['isProSeller'] ?? false,
      maxListings: json['maxListings'] ?? 3,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'branch': branch,
      'year': year,
      'userType': userType,
      'hostel': hostel,
      'roomNumber': roomNumber,
      'phone': phone,
      'avatar': avatar,
      'rating': rating,
      'reviewCount': reviewCount,
      'isVerified': isVerified,
      'isProSeller': isProSeller,
      'maxListings': maxListings,
    };
  }
}
