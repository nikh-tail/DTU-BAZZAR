import 'user_model.dart';

class ListingImageModel {
  final String id;
  final String url;
  final int? order;

  ListingImageModel({
    required this.id,
    required this.url,
    this.order,
  });

  factory ListingImageModel.fromJson(Map<String, dynamic> json) {
    return ListingImageModel(
      id: json['id'] ?? '',
      url: json['url'] ?? '',
      order: json['order'],
    );
  }
}

class ListingModel {
  final String id;
  final String title;
  final String description;
  final num price;
  final String category;
  final String condition;
  final String status;
  final String? campusLocation;
  final int viewsCount;
  final bool featured;
  final String sellerId;
  final UserModel? seller;
  final List<ListingImageModel> images;
  final bool isSaved;
  final dynamic createdAt;

  ListingModel({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.category,
    required this.condition,
    required this.status,
    this.campusLocation,
    this.viewsCount = 0,
    this.featured = false,
    required this.sellerId,
    this.seller,
    this.images = const [],
    this.isSaved = false,
    this.createdAt,
  });

  factory ListingModel.fromJson(Map<String, dynamic> json) {
    var rawImages = json['images'] as List? ?? [];
    List<ListingImageModel> parsedImages = [];
    for (var img in rawImages) {
      if (img is Map<String, dynamic>) {
        parsedImages.add(ListingImageModel.fromJson(img));
      } else if (img is String) {
        parsedImages.add(ListingImageModel(id: '', url: img));
      }
    }

    return ListingModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      price: json['price'] ?? 0,
      category: json['category'] ?? 'OTHERS',
      condition: json['condition'] ?? 'GOOD',
      status: json['status'] ?? 'ACTIVE',
      campusLocation: json['campusLocation'],
      viewsCount: json['viewsCount'] ?? 0,
      featured: json['featured'] ?? false,
      sellerId: json['sellerId'] ?? '',
      seller: json['seller'] != null ? UserModel.fromJson(json['seller']) : null,
      images: parsedImages,
      isSaved: json['isSaved'] ?? false,
      createdAt: json['createdAt'],
    );
  }

  ListingModel copyWith({bool? isSaved}) {
    return ListingModel(
      id: id,
      title: title,
      description: description,
      price: price,
      category: category,
      condition: condition,
      status: status,
      campusLocation: campusLocation,
      viewsCount: viewsCount,
      featured: featured,
      sellerId: sellerId,
      seller: seller,
      images: images,
      isSaved: isSaved ?? this.isSaved,
      createdAt: createdAt,
    );
  }
}
